const MusicNFTCard = ( {songName, owner, imageURL, audioURL, summary, lyric } ) => {

//    console.log( songName, owner, imageURL, audioURL, summary, lyric );
    return (
    <div>
        <div>
            <h3> { songName } </h3>
            <div>
                <img src={ imageURL }/>
            </div>
            <audio src={ audioURL } type="audio/*" controls="controls" preload="metadata"/>
        </div>
        <div>
            <div>作者 : { owner }</div>
            <div>簡介 : { summary }</div>
            <div>歌詞 : { lyric }</div>
        </div>
    </div>
    )
}

export default MusicNFTCard;