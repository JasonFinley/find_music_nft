import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledHeader = styled.header`
  background: rgb(21, 21, 21);
  .nav-link {
    padding: 16px 8px;
    text-decoration: none;
    color: white;
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <div className="container">
        <nav className="d-flex">
          <Link className="nav-link" to="/">Init</Link>
          <Link className="nav-link" to="/home">首頁</Link>
          <Link className="nav-link" to="/user">個人</Link>
          <Link className="nav-link" to="/upload">創作</Link>
          <Link className="nav-link" to="/setting">設定</Link>
        </nav>
      </div>
    </StyledHeader>
  );
};

export default Header;