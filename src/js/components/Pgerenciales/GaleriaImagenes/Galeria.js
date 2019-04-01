import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

class Galeria extends Component{
constructor(){
        super();
        this.state={

        }
}

        render(){
                const IMAGES = [
                        {
                                src: "https://doc-10-8o-docs.googleusercontent.com/docs/securesc/dpqqin4h78fgtj3u91ktbpb3ajk03kes/8ojv7sg29nrsnh3kus1eaaem659j4kif/1536004800000/01540607580040531085/01540607580040531085/1DO2GC060dkLhETguPDgvTsN5sBeVDUkt?e=view",
                                thumbnail: "https://doc-10-8o-docs.googleusercontent.com/docs/securesc/dpqqin4h78fgtj3u91ktbpb3ajk03kes/8ojv7sg29nrsnh3kus1eaaem659j4kif/1536004800000/01540607580040531085/01540607580040531085/1DO2GC060dkLhETguPDgvTsN5sBeVDUkt?e=view",
                                thumbnailWidth: 320,
                                thumbnailHeight: 174,
                                // isSelected: true,
                                caption: "After Rain (Jeshu John - designerspics.com)"
                        },
                        {
                                src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
                                thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212,
                                tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
                                caption: "Boats (Jeshu John - designerspics.com)"
                        },
                        
                        {
                                src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
                                thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212
                        },
                        {
                                src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
                                thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 174,
                                // isSelected: true,
                                caption: "After Rain (Jeshu John - designerspics.com)"
                        },
                        {
                                src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
                                thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212,
                                tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
                                caption: "Boats (Jeshu John - designerspics.com)"
                        },
                        
                        {
                                src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
                                thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212
                        },
                        {
                                src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
                                thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 174,
                                // isSelected: true,
                                caption: "After Rain (Jeshu John - designerspics.com)"
                        },
                        {
                                src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
                                thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212,
                                tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
                                caption: "Boats (Jeshu John - designerspics.com)"
                        },
                        
                        {
                                src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
                                thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
                                thumbnailWidth: 320,
                                thumbnailHeight: 212
                        }
                    ]
             
                return(
                        <div>
                                <Gallery images={IMAGES}/>
                        </div>
                )
        }
}
export default Galeria;
        