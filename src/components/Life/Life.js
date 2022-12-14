import { Fragment, useRef } from "react";
import TypeTitle from "../TypeText";
import { styled } from "@mui/material/styles";
import Browser, { Chrome } from "react-browser-ui";
import { Box, CircularProgress, IconButton, useMediaQuery } from "@mui/material";
import data from "./LifeData.json";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import LazyImage from "components/Lazy/LazyImage";
import { motion, useScroll, useTransform } from "framer-motion";
import CameraIcon from '@mui/icons-material/Camera';
const { Tab, Divider, AddButton } = Chrome;

const BrowserContainer = styled(Box)(({ theme }) => ({
    fontWeight: 500,
    backgroundColor: "#fff",
    color: "#111",
    cursor: "default",
    overflow: "hidden",
    borderRadius: "1.2rem",
    marginTop: theme.spacing(4),
    position: "relative",
}));

const BrowserTabBox = styled(Box)(({ theme }) => ({
    position: "relative",
    zIndex: 1,
    backgroundColor: "transparent",
    overflow: "auto",
    colorScheme: "light",
    "& .MuiImageList-root": {
        marginBottom: 0,
    },
}));

const LifeImgItem = ({ alt, src, place, idx }) => {
    const itemRef = useRef();
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "end end"],
    });

    const margin = 368 - 16 * idx;

    const y = useTransform(scrollYProgress, [0, 1], [margin, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.1, 1]);

    return (
        <ImageListItem key={alt} sx={{ overflow: "visible" }} ref={itemRef}>
            <motion.div whileHover={{ scale: 1.1 }} style={{ y, opacity, borderRadius: "1.6rem", overflow: "hidden" }}>
                <LazyImage src={src} alt={alt} margin={margin + 128} trim={1} width="100%" />
                <ImageListItemBar
                    title={alt}
                    subtitle={`@${place}`}
                    actionIcon={
                        <IconButton href={src} sx={{ marginTop: 0.5 }}>
                            <CameraIcon />
                        </IconButton>
                    }
                    position="below"
                    sx={(theme) => ({
                        fontSize: "1.2rem",
                        [theme.breakpoints.up("md")]: {
                            fontSize: "1.35rem",
                        },
                        ".MuiImageListItemBar-title": {
                            fontSize: "1em",
                            lineHeight: 1.4,
                        },
                        ".MuiImageListItemBar-subtitle": {
                            fontSize: "0.9em",
                            color: "#cacaca",
                        },
                    })}
                />
            </motion.div>
        </ImageListItem>
    );
};

export default function Life(props) {
    const smbk = useMediaQuery("(min-width: 480px)");
    return (
        <Fragment>
            <TypeTitle title="aside from work, i enjoy" id="gallery" />
            <BrowserContainer>
                <Browser
                    type="chrome"
                    showHeader={false}
                    activeTabKey="hkp"
                    tabEnd={(
                        <Fragment>
                            <Divider />
                            <AddButton />
                        </Fragment>
                    )}
                >
                    <Tab key="hkp" title="songs i love right now">
                        <BrowserTabBox sx={{ minHeight: "64vh" }}>
                            <iframe
                                title="My Spotify Playlist"
                                style={{
                                    marginBottom: -4,
                                    height: "max(36rem, 64vh)",
                                }}
                                src="https://open.spotify.com/embed/playlist/7hBSqiY7yd1KdJrSAnA4oG?utm_source=generator" width="100%"
                                frameBorder={0} allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
                            />
                        </BrowserTabBox>
                    </Tab>
                    <Tab key="san" title="platlist w/ my friends">
                        <BrowserTabBox>
                            <iframe
                                title="study at night"
                                style={{
                                    marginBottom: -4,
                                    height: "max(36rem, 64vh)",
                                }}
                                src="https://open.spotify.com/embed/playlist/1tqPkeMlTl7asYMwhUju5V?utm_source=generator" width="100%"
                                frameBorder={0} allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
                            />
                        </BrowserTabBox>
                    </Tab>
                </Browser>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                }} >
                    <CircularProgress color="secondary" />
                </Box>
            </BrowserContainer>
            <ImageList variant="masonry" cols={smbk ? 2 : 1} gap={"max(3.2rem, 6.4vw)"} sx={{
                marginTop: 12,
                overflow: "visible",
                marginBottom: "min(-3.2rem, -6.4vw)",
            }}>
                {data.map((props, idx) => (
                    <LifeImgItem key={idx} idx={idx} {...props} />
                ))}
            </ImageList>
        </Fragment>
    );
};