import classnames from 'classnames';

export default function Banner({banner: {message, type} = {}}) {
	const bannerClass = classnames({show: !!message}, type, 'status-banner');

	return (
		<div className={bannerClass}>
			{message}
		</div>
	);
}
