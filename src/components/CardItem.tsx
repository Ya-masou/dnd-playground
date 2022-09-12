import type { PropsWithChildren } from "react";

export const CardItem = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        borderRadius: 4,
        border: "1px solid black",
        backgroundColor: "white",
        padding: "16px",
      }}
    >
      <div>{children}</div>
      <div
        style={{
          marginTop: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => {
            console.log("click!");
          }}
        >
          Click!!
        </button>
      </div>
    </div>
  );
};
