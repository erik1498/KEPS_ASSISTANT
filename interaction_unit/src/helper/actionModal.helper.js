export const actionModal = (idName, hidden = false) => {
  const modal = document.getElementById(idName);

  if (!modal) {
    return;
  }

  if (hidden) {
    modal.close();
  } else {
    modal.showModal();
  }
};
