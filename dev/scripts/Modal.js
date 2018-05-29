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
            // userID: props.userID
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
            // bookAuthor: this.state.bookData.author.name,
            read: false,
            reading: false
        };
        const addedBookID = this.state.bookID;
        const dbRef = firebase.database().ref(`users/${this.props.userID}/${addedBookID}`);
        dbRef.on("value", snapshot => {
            console.log(snapshot.val());
        });

        dbRef.set(savedBook);
        console.log(addedBookID);
    }

    render () {
        const {bookData, similarBooksDisplay, bookID, authorName} = this.state;
        console.log(bookData);
        console.log(this.state.similarBooksDisplay);
        return (
            <div className="modal">
                <button className="close" onClick={() => this.state.onClose([])}>Close</button>
                <h2>{bookData.title}</h2>
                <h3>by {authorName}</h3>
                <img src={bookData.image_url} alt=""/>
                <div dangerouslySetInnerHTML= {{__html: bookData.description}}/>
                <p>Pages: {bookData.num_pages}</p>
                <p>Rating: {bookData.average_rating}/5</p>
                <a href={bookData.link} target='_blank'>See on Goodreads</a>
                {this.props.loggedIn === true ? <button onClick={this.saveToFirebase} className="add-to-shelf">Add to Shelf</button> : <button onClick={this.props.login}>Login to save book</button>}
                <SimilarBooks
                    similarBooks={similarBooksDisplay} 
                    />                
            </div>
        )
    }
}

export default Modal;