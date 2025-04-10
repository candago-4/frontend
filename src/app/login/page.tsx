import Image from "next/image";
import logo from '../../../public/logo.svg';
import Input from "./components/Input";
import Link from "next/link";

export default function LoginPage(){
    return (
        <main>
        <div className='loginContainer'>
          <Image src={logo} alt={"LynchArea"}></Image>
          <form className="login">
            <Input label="Email" type="email" name="login"></Input>
            <Input label="Senha" type="password" name="password"></Input>
            <Link href={'cadastro'}>Ainda não tem conta? Cadastre-se aqui</Link>
          </form>
          <button className="primary-cta">Entrar</button>
        </div>
        </main>
      );
}