import { scaleLinear } from "d3-scale";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useAdminLineData } from "../data/attendanceData";

const AdminLineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, loading } = useAdminLineData();

  if (loading) return <p>Loading chart...</p>;

  const customYScale = scaleLinear()
    .domain([0, 100])
    .range([0, 500]);

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
        tooltip: { container: { color: colors.primary[500] } },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisBottom={{
        orient: "bottom",
        tickPadding: 5,
        legend: isDashboard ? undefined : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickPadding: 5,
        legend: isDashboard ? undefined : "Adult Attendance",
        legendOffset: -40,
        legendPosition: "middle",
        scale: customYScale,
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default AdminLineChart;
