import React from 'react';

const SavedData = (props) => {
    const checkedReading = props.savedBook.reading === true ? "fa-check-square saved-book__icon--active" : "fa-square";
    const checkedRead = props.savedBook.read === true ? "fa-check-square saved-book__icon--active" : "fa-square";
    return (
        <div className="saved-book clearfix">
            <div className="saved-book__image-container">
                <img className="saved-book__image" src={props.savedBook.bookImage} alt="Book Cover"/>
            </div>
            <div className="saved-book__text">
                <h2 className="saved-book__title">{props.savedBook.bookTitle}</h2>
            </div>
            <div className="saved-book__buttons">
                <div className="saved-book__button-container">
                    <div className="saved-book__button clearfix" onClick={() => props.currentlyReading(props.savedBook.key,props.savedBook.reading)}>
                        <i className={`fa ${checkedReading} saved-book__icon`}></i>
                        <p className="saved-book__ongoing">Currently Reading</p>
                    </div>
                    <div className="saved-book__button clearfix" onClick={() => props.finishedReading(props.savedBook.key,props.savedBook.read)}>
                        <i className={`fa ${checkedRead} saved-book__icon`}></i>
                        <p className="saved-book__finished">Finished Reading</p>
                    </div>
                    <div className="saved-book__button clearfix" onClick={() => props.removeSavedBook(props.savedBook.key)}>
                        <i className="fa fa-times saved-book__icon"></i>
                        <p className="saved-book__remove">Remove Book</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavedData;