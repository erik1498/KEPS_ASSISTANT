import { useNavigate, useLocation, useParams } from 'react-router-dom';

export const withNavigation = (Component) => {
  return (props) => (
    <Component
      {...props}
      navigate={useNavigate()}
      location={useLocation()}
      params={useParams()}
    />
  );
};
