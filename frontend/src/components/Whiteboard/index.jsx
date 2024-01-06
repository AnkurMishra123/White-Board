import React, { useEffect, useLayoutEffect, useState } from 'react'
import rough from "roughjs";

const roughGenerator=rough.generator();


const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool }) => {

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height=window.innerHeight*2;
    canvas.width=window.innerWidth*2;
    const ctx = canvas.getContext("2d");

    ctxRef.current = ctx;
  }, []);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path);
      }
      else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height)
        ); 
      }
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: "black",
        },
      ]);
    }
    else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: "black",
        },
      ]);
    }
    setIsDrawing(true);
  };
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      // console.log(offsetX, offsetY);


      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newPath
              };
            }
            else {
              return ele;
            }

          })
        );
      } else if (tool === "line") {
        setElements((prevElements) => {
          prevElements.map((ele,index)=>{
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }

          })
        })
      }
    }
  };
  const handleMouseUp = (e) => {
    // console.log("mouse up",e);
    setIsDrawing(false);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className='border border-dark border-3 h-100 w-100 overflow-hidden'
    >
      <canvas ref={canvasRef}

      />
    </div>
  );
};

export default WhiteBoard;