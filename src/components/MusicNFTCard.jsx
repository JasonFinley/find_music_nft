import styled from 'styled-components';

const MusicNFTCardStyled = styled.header`
    .card_bg{
        margin : 2px;
        padding : 2px;
        border-color: black;
        border-width: 3px;
        border-style: solid;
        border-radius: 10px 10px 10px 10px;
    }

`;

const MusicNFTCard = ( {songName, owner, imageURL, audioURL, summary, lyric } ) => {

//    console.log( songName, owner, imageURL, audioURL, summary, lyric );
    return (
        <MusicNFTCardStyled>
            <div className='card_bg'>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <h3> { songName } </h3>
                    <div>
                        <img src={ imageURL }/>
                    </div>
                    <div >
                        <audio src={ audioURL } type="audio/*" controls="controls" preload="metadata"/>
                    </div>
                </div>
                <div>
                    <div>作者 : { owner }</div>
                    <div>簡介 : { summary }</div>
                    <div>歌詞 : { lyric }</div>
                </div>
            </div>
        </MusicNFTCardStyled>
    )
}

export default MusicNFTCard;