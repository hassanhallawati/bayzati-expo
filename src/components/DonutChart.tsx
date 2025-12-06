import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Text, YStack } from "tamagui";

interface DonutChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  backgroundColor?: string;
  centerText: string;
  subText: string;
}

export default function DonutChart({
  percentage,
  size = 200,
  strokeWidth = 20,
  primaryColor = "#FACC15",
  backgroundColor = "#EAEAEA",
  centerText,
  subText,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90, ${center}, ${center})`}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {/* Center text overlay */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={32} fontWeight="700" color="#333333">
          {centerText}
        </Text>
        <Text
          fontSize={12}
          color="#7a7a7a"
          textAlign="center"
          marginTop={4}
          paddingHorizontal={20}
        >
          {subText}
        </Text>
      </YStack>
    </View>
  );
}
