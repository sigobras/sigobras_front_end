import React, { Component } from 'react';
import {
	Carousel,
	CarouselItem,
	CarouselControl,
	CarouselIndicators,
	CarouselCaption,
} from 'reactstrap';
import carouselImage1 from '../../../../public/images/carousel-image-1.jpg';
import carouselImage2 from '../../../../public/images/carousel-image-2.jpg';
import carouselImage3 from '../../../../public/images/carousel-image-3.jpg';

const items = [
	{
		id: 1,
		caption: 'PROCESOS FÍSICOS',
		altText: '',
		src: carouselImage1,
	},
	{
		id: 2,
		caption: 'PROCESOS GERENCIALES',
		altText: '',
		src: carouselImage2,
	},
	{
		id: 3,
		caption: 'PROCESOS FINANCIEROS',
		altText: '',
		src: carouselImage3,
	},
];

class Slider extends Component {
	constructor(props) {
		super(props);
		this.state = { activeIndex: 0 };
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.goToIndex = this.goToIndex.bind(this);
		this.onExiting = this.onExiting.bind(this);
		this.onExited = this.onExited.bind(this);
	}

	onExiting() {
		this.animating = true;
	}

	onExited() {
		this.animating = false;
	}

	next() {
		if (this.animating) return;
		const nextIndex =
			this.state.activeIndex === items.length - 1
				? 0
				: this.state.activeIndex + 1;
		this.setState({ activeIndex: nextIndex });
	}

	previous() {
		if (this.animating) return;
		const nextIndex =
			this.state.activeIndex === 0
				? items.length - 1
				: this.state.activeIndex - 1;
		this.setState({ activeIndex: nextIndex });
	}

	goToIndex(newIndex) {
		if (this.animating) return;
		this.setState({ activeIndex: newIndex });
	}

	render() {
		const { activeIndex } = this.state;

		const slides = items.map(item => {
			return (
				<CarouselItem
					className='custom-tag'
					tag='div'
					key={item.id}
					onExiting={this.onExiting}
					onExited={this.onExited}
				>
					<img
						src={item.src}
						alt={item.altText}
						width='100%'
						style={{ height: '-webkit-fill-available' }}
					/>

					<CarouselCaption
						className='h1'
						captionText={item.altText}
						captionHeader={item.caption}
					/>
				</CarouselItem>
			);
		});

		return (
			<div className='contenSilider'>
				<style>
					{`.custom-tag {
                max-width: 100%;
                height: 400px;
                background: black;
              }`}
				</style>
				<Carousel
					activeIndex={activeIndex}
					next={this.next}
					previous={this.previous}
				>
					<CarouselIndicators
						items={items}
						activeIndex={activeIndex}
						onClickHandler={this.goToIndex}
					/>
					{slides}
					<CarouselControl
						direction='prev'
						directionText='Previous'
						onClickHandler={this.previous}
					/>
					<CarouselControl
						direction='next'
						directionText='Next'
						onClickHandler={this.next}
					/>
				</Carousel>
			</div>
		);
	}
}
export default Slider;
