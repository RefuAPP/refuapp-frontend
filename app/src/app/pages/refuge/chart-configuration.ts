export type ChartConfiguration = {
  layout: {
    background: {
      color: string;
    };
    textColor: string;
  };
  width: number;
  height: number;
};

export function getChartConfiguration(
  textColor: string,
  backgroundColor: string,
): ChartConfiguration {
  return {
    layout: {
      background: {
        color: backgroundColor,
      },
      textColor: textColor,
    },
    width: 3000,
    height: 300,
  };
}
