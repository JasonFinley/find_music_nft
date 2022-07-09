import styled from 'styled-components';

const CreatorCardStyled = styled.header`
    .card_bg{
        margin : 2px;
        padding : 2px;
        border-color: blue;
        border-width: 3px;
        border-style: solid;
        border-radius: 0 10px 0 10px;
    }
    .creator_bg{
        display: flex;
        .creator_img{
            margin: auto;
        }
    }
`;

const CreatorCard = ( { creatorAddress, creatorName, creatorURL, summary, onPress } ) => {

    const btnClick = () => {
        onPress( creatorAddress );
    }

    return (
        <CreatorCardStyled>
            <div className="card_bg">
                <div className="creator_bg">
                    <img className="creator_img" src={ creatorURL }/>
                </div>
                <div className="card_info">
                    <div>作者 : { creatorName }</div>
                    <div>簡介 : { summary }</div>
                </div>
                <button onClick={ btnClick } >看作品</button>
            </div>
        </CreatorCardStyled>
    )
}
    
export default CreatorCard;