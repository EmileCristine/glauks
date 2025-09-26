import estilos from './Header.module.css';
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { LuBell } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import ImgPerfil from '../assets/images/icon-white.png';
import { useBusca } from '../context/BuscaContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { termoBusca, setTermoBusca } = useBusca();
  const { user, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <header className={estilos.section}>
      <div className={estilos.pesquisa}>
        <form className={estilos.input} onSubmit={handleSubmit}>
          <div className={estilos.icon}>
            <PiMagnifyingGlassBold />
          </div>
          <input 
            type="text" 
            placeholder='Pesquisar' 
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </form> 
      </div>

      <div className={estilos.abaPerfil}>
        <div className={estilos.notificacao}>
          <div className={estilos.icon}><LuBell /></div>
          <div className={estilos.img}>
            <img 
              className={estilos.perfilImg}
              src={ImgPerfil}
              alt="Perfil"
            /> 
          </div>
          <div className={estilos.adm}>
            <h1>{user?.displayName || user?.email || 'Admin'}</h1>
            <div className={estilos.icon}><IoIosArrowDown /></div>
          </div>
          <button 
            className={estilos.logoutBtn}
            onClick={handleLogout}
            title="Sair"
          >
            <IoLogOutOutline />
          </button>
        </div>
      </div>
    </header>
  );
}