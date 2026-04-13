import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import Nav from "../../components/Nav";
import QuizInterface from "../../components/QuizInterface";
import { db } from "../../config/firebase";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);
      const usersSnapArray = [];
      usersSnap.forEach((doc) => {
        usersSnapArray.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersSnapArray);
    }

    getUsers();
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px]">
        <h2 className="text-[#fff] text-5xl text-center py-8">Users</h2>
        {users?.map((user) => (
          <div key={user?.id}>
            <p>{user?.displayName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
