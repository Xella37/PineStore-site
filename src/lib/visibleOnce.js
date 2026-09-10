export function visibleOnce(node, callback, options = {}) {
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting) {
				callback();
				observer.unobserve(node);
			}
		},
		{
			rootMargin: "250px 0px", // preload slightly before visible
			threshold: 0.1,
			...options
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}