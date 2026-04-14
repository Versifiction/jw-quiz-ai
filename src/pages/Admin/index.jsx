import AdminDashboard from "../../components/AdminDashboard";
import { app } from "../../config/firebase";

function Admin() {
  return <AdminDashboard firebaseApp={app} />;
}

export default Admin;
