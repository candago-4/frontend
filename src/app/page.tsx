import Image from "next/image";
import styles from "./page.module.css";
import logo from '../../public/logo.svg';
import AuthHandler from "./components/AuthHandler";
export default function Home() {
  return (
    <AuthHandler allowedRoles={['candago']}>
      <h1>Logado</h1>
    </AuthHandler>
    
  );
}
