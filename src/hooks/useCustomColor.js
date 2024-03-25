
const useCustomColor = (total_people, select_people, num_color = 7) => {
	let color = [
		'D0D0D0',
		'E0CEFF',
		'BEA1FE',
		'A988F0',
		'8D63E8',
		'6330DE',
		'4B1CBC',
		'400099',
	];
	let ratio = select_people / total_people;
	let outputIdx = Math.floor(ratio * num_color + 0.5);

	if (outputIdx === 0) {
		if (select_people !== 0) {
			outputIdx = 1;
		}
	}

	// return outputIdx;
	return '#' + color[outputIdx];
};

export default useCustomColor;