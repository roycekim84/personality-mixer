import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>;
}

export function Card({ children, pad = true }: { children: React.ReactNode; pad?: boolean }) {
  return <div className={`card ${pad ? "pad" : ""}`}>{children}</div>;
}

export function Header({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle?: string;
  tag?: React.ReactNode;
}) {
  return (
    <div className="header">
      <div>
        <h1 className="h-title">{title}</h1>
        {subtitle ? <div className="h-sub">{subtitle}</div> : null}
      </div>
      {tag ? <div className="modeTag">{tag}</div> : null}
    </div>
  );
}
