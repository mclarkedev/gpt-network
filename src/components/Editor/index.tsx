import styles from "./index.module.css";

import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useState } from "react";

import suggestion from "./suggestion";

const makeMentionChip = (id: string) => {
  return `<span data-type="mention" data-id="${id}" class=${styles.mention} contenteditable="false">@${id}</span>`;
};

const separator = "__SEPARATOR__:45#$__NO_ONE_WOULD_TYPE";
const defaultContent = ["Who is similar to ", separator, "?"];

const stitchContent = (contentArray = defaultContent, id: string) => {
  return contentArray
    .map((content) => {
      if (content === separator) {
        return makeMentionChip(id);
      } else {
        return content;
      }
    })
    .join("");
};

/**
 * Editor displays a Tip Tap editor with ability to update an activeMention
 */
export default function Editor({ activeMention = "Start node" }) {
  const defaultHTML = stitchContent(defaultContent, activeMention);
  const [virtualContent, setVirtualContent] = useState<string[]>();
  const virtualHTML = stitchContent(virtualContent, activeMention);
  const limit = 2000;

  const editor = useEditor(
    {
      extensions: [
        Document,
        Paragraph,
        Text,
        CharacterCount.configure({
          limit,
        }),
        Mention.configure({
          HTMLAttributes: {
            class: styles.mention,
          },
          suggestion: {
            items: () => [activeMention],
            render: suggestion.render,
          },
        }),
      ],
      // Swap out content after its been edited
      onDestroy: () => console.log("destroy"),
      content: virtualHTML ? virtualHTML : defaultHTML,
      onUpdate: ({ editor }) => {
        const { content } = editor.getJSON();
        const contentArr = content?.[0].content?.map((item) => {
          if (item.type === "text") {
            return item.text ? item.text : "";
          }
          if (item.type === "mention") {
            return separator;
          } else return "";
        });
        // Save editor content so we can display it to the user on flash updates
        setVirtualContent(contentArr);
      },
    },
    // HACK: Destroy and build new editor with active mention
    [activeMention]
  );

  // const limit = 280;
  // const percentage = editor
  //   ? Math.round((100 / limit) * editor.storage.characterCount.characters())
  //   : 0;

  return (
    <div className="relative whitespace-normal">
      <EditorContent editor={editor} />
      {/* HACK: Display virtualHtml so text always appears to user, even when EditorContent is blank */}
      <div
        className="absolute top-0 whitespace-normal z-0 pointer-events-none fon"
        style={{ fontVariant: "none" }}
        dangerouslySetInnerHTML={{ __html: virtualHTML }}
      ></div>
      {/* Disable character count for now */}
      {/* {editor && (
        <div
          className={`character-count ${
            editor.storage.characterCount.characters() === limit
              ? "character-count--warning"
              : ""
          } absolute top-0 right-0 m-0`}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            className="character-count__graph"
          >
            <circle r="10" cx="10" cy="10" fill="rgb(88, 88, 88)" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="rgb(88, 88, 88)" />
          </svg>

          {/* <div className="character-count__text">
            {editor.storage.characterCount.characters()}/{limit}
          </div>
        </div>
      )} */}
    </div>
  );
}
