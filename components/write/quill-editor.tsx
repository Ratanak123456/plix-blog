"use client";

import { useEffect, useRef } from "react";

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<{
    root: HTMLDivElement;
    clipboard: { dangerouslyPasteHTML: (html: string) => void };
    on: (event: "text-change", handler: () => void) => void;
  } | null>(null);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    let isActive = true;

    async function setupEditor() {
      if (!containerRef.current || quillInstanceRef.current) {
        return;
      }

      const { default: Quill } = await import("quill");
      if (!isActive || !containerRef.current) {
        return;
      }

      const editorHost = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(editorHost);

      const quill = new Quill(editorHost, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      if (latestValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(latestValueRef.current);
      }

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillInstanceRef.current = quill;
    }

    void setupEditor();

    return () => {
      isActive = false;
      quillInstanceRef.current = null;
    };
  }, [onChange, placeholder]);

  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill || quill.root.innerHTML === value) {
      return;
    }

    const selection = window.getSelection();
    quill.clipboard.dangerouslyPasteHTML(value || "");
    selection?.removeAllRanges();
  }, [value]);

  return <div ref={containerRef} className="quill-shell min-h-[22rem]" />;
}
