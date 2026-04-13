/* eslint-disable react/prop-types */
import Button from "../ui/Button";
import { LuX } from "react-icons/lu";
import { TiUserDelete } from "react-icons/ti";

export default function DeleteAccountModal({
  isOpen,
  onClose,
  children,
  deleteAccount,
}) {
  if (!isOpen) return null;

  return (
    <div className="space-y-4 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <h1 className="text-[#4A6DA7] text-3xl text-center py-8">
          Suppression de compte
        </h1>
        <p>
          Êtes-vous sûr de vouloir supprimer votre compte ? Toute action sera
          définitive !
        </p>
        <div className="my-4">
          <Button
            variant="destructive"
            iconRight={<TiUserDelete />}
            onClick={deleteAccount}
            className="mr-2"
          >
            Supprimer le compte
          </Button>
          <Button variant="outline" iconRight={<LuX />} onClick={onClose}>
            Annuler
          </Button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import Modal from "../ui/AnimationModal";
// import Button from "../button/button";
// const BasicModalView = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   return <div className="space-y-4">
//       <Button onClick={() => setIsOpen(true)} variant="default">
//         Open Basic Modal
//       </Button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Basic Modal">
//         <div className="space-y-4">
//           <p className="text-gray-700 dark:text-gray-300">
//             This is a basic modal example. You can put any content here. The
//             modal will close when you click the X button, press ESC, or click
//             outside the modal.
//           </p>
//           <div className="flex justify-end">
//             <Button onClick={() => setIsOpen(false)} variant="secondary">
//               Close
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>;
// };
// export default BasicModalView;
