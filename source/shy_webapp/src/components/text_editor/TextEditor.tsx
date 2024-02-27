import React from "react";
import { useRouter } from "next/navigation";
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
// import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
// import { shyApi2 } from "@taigalabs/shy-api-js";
// import { CreateShyPostRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostRequest";
// import { ShyPost } from "@taigalabs/shy-entities/bindings/ShyPost";

import styles from "./TextEditor.module.scss";
import { i18nContext } from "@/i18n/context";
import Button from "@/components/button/Button";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ HTMLAttributes: { types: [ListItem.name] } }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Link.extend({
    inclusive: false,
  }).configure({
    autolink: true,
  }),
  Placeholder.configure({
    emptyEditorClass: styles.isEditorEmpty,
    placeholder:
      "Type here. You can use Markdown to format. Copy pasting images will later be supported.",
  }),
];

const content = `
  <p><span>This has a &lt;span&gt; tag without a style attribute, so it’s thrown away.</span></p>
  <p><span style="color: blue;">But this one is wrapped in a &lt;span&gt; tag with an inline style attribute, so it’s kept - even if it’s empty for now.</span></p>
`;

const EditorMenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        italic
      </button>
    </div>
  );
};

// const EditorFooter: React.FC<EditorFooterProps> = ({ handleClickPost }) => {
//   const i18n = React.useContext(i18nContext);
//   const { editor } = useCurrentEditor();
//   const router = useRouter();

//   const extendedHandleClickPost = React.useCallback(() => {
//     if (!editor) {
//       return null;
//     }

//     const html = editor.getHTML();
//     handleClickPost(html);
//   }, [handleClickPost, editor]);

//   return (
//     <div className={styles.footer}>
//       <Button variant="green_1" handleClick={extendedHandleClickPost}>
//         {i18n.post}
//       </Button>
//     </div>
//   );
// };

const TextEditor: React.FC<TextEditorProps> = ({ footer }) => {
  const editor = useEditor({
    extensions,
    content,
  });

  if (!editor) {
    return null;
  }

  // const footer = <EditorFooter handleClickPost={handleClickPost} />;

  return (
    <div className={styles.wrapper}>
      <EditorProvider
        editorProps={{
          attributes: {
            class: `${styles.editor}`,
          },
        }}
        // slotBefore={<EditorMenuBar />}
        slotAfter={footer}
        extensions={extensions}
        content={""}
      >
        <div className={styles.wrapper}></div>
      </EditorProvider>
    </div>
  );
};

export default TextEditor;

export interface TextEditorProps {
  footer: React.JSX.Element;
  // handleClickPost: (html: string) => void;
}
