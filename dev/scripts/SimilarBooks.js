import React from 'react';

const SimilarBooks = (props) => {
    return (
        <div className="similar-books clearfix">
            <h2 className="similar-books__subtitle">Similar Books</h2>
                {props.similarBooks.map((book) => {
                    return (
                        <div className="similar-books__book" key={book.isbn}>
                            <div className="similar-books__image-container">
                                {book.image_url.includes("nophoto") ? <div className="similar-books__no-photo"><p className="similar-books__no-photo-text">{book.title}</p></div> : <img className="similar-books__image" src={book.image_url} alt="Book cover"/>}
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default SimilarBooks;