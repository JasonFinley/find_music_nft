const CreatorCard = ( { creator, creatorURL, summary } ) => {

        return (
        <div>
            <div>
                <img src={ creatorURL }/>
            </div>
            <div>
                <div>作者 : { creator }</div>
                <div>簡介 : { summary }</div>
            </div>
        </div>
        )
    }
    
    export default CreatorCard;