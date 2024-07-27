/**
 * Wrap lines in a string with <br> tags
 */
export const wrapLines = (text: string) => {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));
};