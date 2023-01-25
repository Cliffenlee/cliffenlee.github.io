import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import styles from "./scroll.module.css";

export default function Scroll({
  coverScrolled,
}: {
  coverScrolled: boolean;
}): JSX.Element {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const canvasRef = useRef(null);
  const imagesRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      setHeight(200);
      setWidth(200);
    };
    onResize();
    window.addEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (coverScrolled && height > 0 && width > 0 && canvasRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      console.log("setting");
      const images = imagesRef.current?.children;
      console.log(images);

      const imagesInfo = {
        totalFrames: 30,
        currentFrame: 0,
        images,
      };

      const render = () => {
        console.log(imagesInfo.currentFrame);
        // console.log(imagesInfo.images[imagesInfo.currentFrame]);
        canvasRef.current
          ?.getContext("2d")
          .drawImage(
            imagesInfo.images[imagesInfo.currentFrame],
            0,
            0,
            canvasRef.current?.width,
            canvasRef.current?.height
          );
      };
      console.log("registered");
      console.log(canvasRef.current);
      console.log(coverScrolled);
      gsap.to(imagesInfo, {
        currentFrame: imagesInfo.totalFrames - 1,
        snap: "currentFrame",
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top",
          markers: true,
          scrub: true,
          pin: true,
        },
      });
      render();
    }
  }, [coverScrolled, height, width, canvasRef]);

  return (
    <div className={styles.pinRef} ref={pinRef}>
      <canvas height={height} width={width} ref={canvasRef}>
        <div className={styles.images} ref={imagesRef}>
          {[...Array(30)].map((e, i) => (
            <img
              alt="a frame"
              src={`/frames/frame_${i
                .toString()
                .padStart(2, "0")}_delay-0.03s.png`}
              key={i}
            />
          ))}
        </div>
      </canvas>
    </div>
  );
}
