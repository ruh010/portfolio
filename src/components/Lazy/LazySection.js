import { Box, CircularProgress, Typography } from "@mui/material";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState, Component } from "react";
import { styled } from "@mui/material/styles";
import { Alert, AlertTitle } from "@mui/material";

const ErrorContainer = styled((props) => (
    <Alert severity="error" {...props} />
))(({ theme }) => ({
    borderRadius: "1.2rem",
    marginBottom: theme.spacing(3),
}));

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    componentDidCatch(error) {
        this.setState({ error: `${error.name}: ${error.message}` });
    }

    render() {
        const { error } = this.state;
        if (error) {
            return (
                <ErrorContainer>
                    <AlertTitle>Check Your Network Connection</AlertTitle>
                    {error}
                </ErrorContainer>
            );
        }
        return this.props.children;
    }
};

const LazyFallback = ({ name, error }) => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
        }}>
            <CircularProgress />
            <Typography sx={{
                fontSize: "1.6rem",
                marginTop: 3,
                textTransform: "lowercase",
            }} color={error && "error"}>
                {error || `loading ${name} section...`}
            </Typography>
        </Box>
    );
};

const loadComponent = async (path, cb, handler) => {
    const comp = await import(`../${path}.js`).catch((err) => handler(err.toString()));
    comp && cb(comp);
};

export default function LazySection({ sections, children, ...props }) {
    const ref = useRef(null);
    const [component, setComponent] = useState(null);
    const [error, setError] = useState(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "0px 0px 64px 0px",
    });
    const componentPath = sections[0];
    const name = componentPath.split("/").pop();

    useEffect(() => {
        isInView && loadComponent(componentPath, setComponent, setError);
    }, [isInView, componentPath]);

    return (
        <ErrorBoundary>
            <Box component="section" ref={ref} {...props} sx={{ marginTop: 9 }}>
                {component ? <component.default /> : <LazyFallback name={name} error={error} />}
            </Box>
            {component && sections.length > 1 && <LazySection sections={sections.slice(1,)} />}
        </ErrorBoundary>
    );
};