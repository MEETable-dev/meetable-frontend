import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const PButton = styled.button`


align-self: center;
width: 260px;
height: 48px;
color: #fff;
border: none;
border-radius: 5px;
font-size: 1rem;
font-weight: bold;
padding: 0.25rem 1rem;
outline: none;
cursor: pointer;

background: ${palette.login_purple[0]};
`;

const GButton = styled.button`

display: flex;
justify-content: center;
align-items: center;
width: 16.25rem;
height: 3rem;
color: #fff;
border: none;
border-radius: 5px;
font-size: 1rem;
font-weight: bold;
padding: 0.25rem 1rem;
outline: none;
cursor: pointer;
background: ${palette.login_gray[1]};
margin-top: 3rem;


div{
    
    font-size: 1rem;
    font-weight: bold;
}
`;

const PurpleButton = props =><PButton {...props}/>;
const GrayButton = props=> <GButton {...props}/>;


export { PurpleButton, GrayButton} ;
