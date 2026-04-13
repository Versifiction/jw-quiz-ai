/* eslint-disable react/prop-types */
import Button from "../ui/Button";
import Modal from "../ui/AnimationModal"

export default function DeleteAccountModal({
  isOpen,
  onClose,
  children,
  cancelAccount,
}) {
  if (!isOpen) return null;

  return (
    <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This is a basic modal example. You can put any content here. The
            modal will close when you click the X button, press ESC, or click
            outside the modal.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </Modal>
  );
}

