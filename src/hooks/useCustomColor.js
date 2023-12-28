
const useCustomColor = (
  total_people,
  select_people,
  num_color = 7
) => {
  let color = ['D0D0D0', 'E0CEFF',	'BEA1FE',	'A988F0',	'8D63E8',	'6330DE',	'4B1CBC',	'400099'];
  let quotient = Math.floor(total_people / num_color) + 1;
  let output_color = 0;

  if (select_people !== 0) output_color = Math.floor(select_people / quotient) + 1;
  return '#'+color[output_color]
};
export default useCustomColor;