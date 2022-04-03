import "./App.css";
import classNames from "classnames";
import { useState } from "react";

function App() {
  // hooks for keepiing track of touch distance
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [xAtTouchPointStart, setXAtTouchPointStart] = useState(0);
  const [yAtTouchPointStart, setYAtTouchPointStart] = useState(0);

  // hook to keep track of drag and drop status
  const [isDragging, setIsDragging] = useState(false);
  // hook to update styles
  const [positionStyle, setPositionStyle] = useState("App-bottom-left");

  let videoPlayer = document.getElementById("videoId");

  function toggleVideoPlayback() {
    if (!videoPlayer) return;

    const isVideoPlaying = !!(
      videoPlayer.currentTime > 0 &&
      !videoPlayer.paused &&
      !videoPlayer.ended &&
      videoPlayer.readyState > 2
    );

    if (!isVideoPlaying) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }

  // function used to set styles on target element
  function setVideoStyles() {
    if (top === 0 || left === 0) {
      return;
    }

    if (top < 0 && left <= 0) {
      setPositionStyle("App-top-left");
    } else if (top < 0 && left > 0) {
      setPositionStyle("App-top-right");
    } else if (top > 0 && left > 0) {
      setPositionStyle("App-bottom-right");
    } else if (top > 0 && left < 0) {
      setPositionStyle("App-bottom-left");
    }
  }

  // function invoked when touch event for mobile is started
  const onTouchStartListener = (e) => {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    const x = +touch.pageX;
    const y = +touch.pageY;

    // get the mouse cursor position at startup
    setXAtTouchPointStart(x);
    setYAtTouchPointStart(y);
    setIsDragging(true);
    // toggleVideoPlayback();
  };

  // function invoked when touch for mobile is ended
  const onTouchEndListener = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setVideoStyles();
    if (!isDragging) toggleVideoPlayback();
  };

  // function invoked while touch event is going on (mobile)
  const onTouchMoveListener = (e) => {
    e = e || window.event;
    // e.preventDefault();
    let x = 0;
    let y = 0;

    if (
      e.type === "touchstart" ||
      e.type === "touchmove" ||
      e.type === "touchend" ||
      e.type === "touchcancel"
    ) {
      let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
      let touch = evt.touches[0] || evt.changedTouches[0];
      x = +touch.pageX; // X Coordinate relative to the viewport of the touch point
      y = +touch.pageY; // same for Y
    } else if (
      e.type === "mousedown" ||
      e.type === "mouseup" ||
      e.type === "mousemove" ||
      e.type === "mouseover" ||
      e.type === "mouseout" ||
      e.type === "mouseenter" ||
      e.type === "mouseleave"
    ) {
      x = +e.clientX;
      y = +e.clientY;
    }
    // calculate the new cursor position:
    const xRelativeToStart = x - xAtTouchPointStart;
    const yRelativeToStart = y - yAtTouchPointStart;

    setTop(yRelativeToStart);
    setLeft(xRelativeToStart);

    videoPlayer && videoPlayer.pause();
  };

  // function invoked when touch for desktop is started
  const onPointerDownListener = (e) => {
    const x = e.pageX;
    const y = e.pageY;
    // get the mouse cursor position at startup:
    setXAtTouchPointStart(x);
    setYAtTouchPointStart(y);
    setIsDragging(true);
  };

  // function invoken when touch for desktop is ended
  const onPointerUpListener = () => {
    if (!isDragging) toggleVideoPlayback();
  };

  // function invoked while pointer is moved on elenent (desktop)
  const onPointerMoveListener = (e) => {
    // intentionally left empty
  };

  // function invoked while pointer leaves element (desktop)
  const onPointerLeaveListener = (e) => {
    let x = +e.clientX;
    let y = +e.clientY;

    // calculate the new cursor position:
    const xRelativeToStart = x - xAtTouchPointStart;
    const yRelativeToStart = y - yAtTouchPointStart;

    // set the element's new position:
    setTop(yRelativeToStart);
    setLeft(xRelativeToStart);
    setIsDragging(false);
    setVideoStyles();
  };

  return (
    <div className="App">
      <div
        className={classNames("App-video-element", positionStyle)}
        draggable
        onTouchStart={(e) => onTouchStartListener(e)}
        onTouchEnd={onTouchEndListener}
        onTouchMove={onTouchMoveListener}
        onPointerDown={(e) => onPointerDownListener(e)}
        onPointerUp={onPointerUpListener}
        onPointerMove={onPointerMoveListener}
        onPointerLeave={onPointerLeaveListener}
        style={{ backgroundColor: isDragging ? "white" : "purple" }}
      >
        <video
          width={"100%"}
          height={"100%"}
          controls
          autoPlay={false}
          id={"videoId"}
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
        </video>
      </div>
    </div>
  );
}

export default App;
