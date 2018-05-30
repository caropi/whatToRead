import React from 'react';
import axios from "axios";
import qs from "qs";
import firebase from 'firebase';
import SimilarBooks from "./SimilarBooks";

//id needs to be a variable
//hook in selected book
//selected book will pass id as props and our component will use that id to call axios

//we need to map [or for loop] through similar books 10 at a time

//similar_books
//title
//publication_year
//num_pages
//image_url
//authors > author > name
//average_rating
//description
//link

class Modal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            singleTitle: [],
            bookID: props.bookID,
            bookData: [],
            onClose: props.onClose,
            similarBooksDisplay: [],
            authors: [],
            authorName: ""
        }
        this.authorDisplay = this.authorDisplay.bind(this);
        this.saveToFirebase = this.saveToFirebase.bind(this);
    }

    componentDidMount () {
        axios({
        url: "http://proxy.hackeryou.com",
        method: "GET",
        dataResponse: "JSON",
        paramsSerializer: function(params) {
            return qs.stringify(params, { arrayFormat: "brackets" });
        },
        params: {
            reqUrl: "https://www.goodreads.com/book/show.xml",
            params: {
            id: this.state.bookID,
            key: "GwIYI1RLhhFBh2UPUeLNw"
            },
            xmlToJSON: true
        }
        }).then((res) =>{
            const bookData = res.data.GoodreadsResponse.book;
            const authors = bookData.authors.author;
            const similarBooks = bookData.similar_books.book;

            const similarBooksDisplay = similarBooks.slice(0, 5);

            this.setState ({
                bookData: bookData,
                similarBooksDisplay: similarBooksDisplay,
                authors: authors
            });

            this.authorDisplay();
            this.results.scrollIntoView({ behavior: "smooth" });
        })
    }

    // If multiple authors, pulls main author from array, else pulls single author.
    authorDisplay() {
        if (Array.isArray(this.state.authors)) {
            this.setState ({
                authorName: this.state.authors[0].name
            });
        } else {
            this.setState ({
                authorName: this.state.authors.name
            });
        }
    }


    saveToFirebase() {
        const savedBook = {
            bookImage: this.state.bookData.image_url,
            bookTitle: this.state.bookData.title,
            read: false,
            reading: false
        };
        const addedBookID = this.state.bookID;
        const dbRef = firebase.database().ref(`users/${this.props.userID}/${addedBookID}`);
        dbRef.on("value", snapshot => {
            console.log(snapshot.val());
        });

        dbRef.set(savedBook);
    }

    render () {
        const {bookData, similarBooksDisplay, bookID, authorName} = this.state;

        return (
            <div ref={node => this.results = node} className="modal">
                <div className="modal__close-button" onClick={() => this.state.onClose([])}>
                    <i className="fa fa-times modal__close-icon"></i>
                </div>
                <h2 className="modal__title">{bookData.title}</h2>
                <div className="modal__author-page clearfix">
                    <h3 className="modal__author">by {authorName}</h3>
                    <p className="modal__page-number">Pages: {bookData.num_pages}</p>
                </div>
                <div className="modal__details clearfix">
                    <div className="modal__image-button clearfix">
                        <div className="modal__image-container">
                            <img className="modal__image" src={bookData.image_url} alt="Book Cover"/>
                        </div>
                        {this.props.loggedIn === true ? <button className="modal__save-button" onClick={this.saveToFirebase}>Add to Shelf</button> : <button className="modal__save-button" onClick={this.props.login}>Login to save book</button>}
                        <div className="modal__rating">
                            <p className="modal__rating-text">Rating:</p>
                            <p className="modal__score">{bookData.average_rating}/5</p>
                        </div>
                    </div>
                    <div className="modal__text">
                        <p className="modal__description" dangerouslySetInnerHTML={{__html: bookData.description}}></p>
                        <a className="modal__link" href={bookData.link} target='_blank'>View book on Goodreads</a>
                    </div>
                </div>

                <SimilarBooks
                    similarBooks={similarBooksDisplay} 
                    />                
            </div>
        )
    }
}

export default Modal;