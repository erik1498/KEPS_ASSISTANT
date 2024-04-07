export const ModalMiddle = ({ id = '', children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">{children}</div>
    </dialog>
  );
};
