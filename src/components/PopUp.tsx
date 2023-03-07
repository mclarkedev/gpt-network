/**
 * PopUp
 */
export default function PopUp({
  position,
  children,
  onClickOutside,
  onMouseOverOutside,
}: any) {
  return (
    <div>
      <div
        className="absolute bg-neutral-800 rounded-xl"
        style={{
          zIndex: 999999,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {children}
      </div>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-white bg-opacity-0"
        onClick={onClickOutside}
        onMouseOver={onMouseOverOutside}
      ></div>
    </div>
  );
}
