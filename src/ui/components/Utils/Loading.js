import classnames from 'classnames';

export default function Loading({isSmall, isCentered}) {
	const loaderClassName = classnames({
		centered: isCentered,
		small: isSmall
	}, 'loader');

	return (
		<div className={loaderClassName}>
			<div className="r1" />
			<div className="r2" />
			<div className="r3" />
			<div className="r4" />
			<div className="r5" />
		</div>
	);
}
