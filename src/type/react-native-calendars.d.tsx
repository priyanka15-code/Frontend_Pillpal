import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ViewProps,
} from 'react-native';

// Define types for react-native-calendars module
declare module 'react-native-calendars' {
  // Fix: Use only 'open' | 'closed' as per the error message
  export type Positions = 'open' | 'closed'; // Ensure this matches the expected type in the module

  export interface Datedata {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
  }

  export interface Marking {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    activeOpacity?: number;
    selectedColor?: string;
    textColor?: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
    customStyles?: {
      container?: StyleProp<ViewStyle>;
      text?: StyleProp<TextStyle>;
    };
  }

  export interface MarkedDates {
    [date: string]: Marking;
  }

  // Extend the existing Theme type from the module
    // Define the Theme type locally as it is not exported by 'react-native-calendars'
    export interface Theme {
      backgroundColor?: string;
      calendarBackground?: string;
      textSectionTitleColor?: string;
      textSectionTitleDisabledColor?: string;
      selectedDayBackgroundColor?: string;
      selectedDayTextColor?: string;
      todayTextColor?: string;
      dayTextColor?: string;
      textDisabledColor?: string;
      dotColor?: string;
      selectedDotColor?: string;
      arrowColor?: string;
      disabledArrowColor?: string;
      monthTextColor?: string;
      indicatorColor?: string;
      textDayFontFamily?: string;
      textMonthFontFamily?: string;
      textDayHeaderFontFamily?: string;
      textDayFontWeight?: string;
      textMonthFontWeight?: string;
      textDayHeaderFontWeight?: string;
      textDayFontSize?: number;
      textMonthFontSize?: number;
      textDayHeaderFontSize?: number;
    }
    export type CalendarTheme = Theme & {
      'stylesheet.calendar.header'?: ViewStyle;
      'stylesheet.day.basic'?: ViewStyle;
      'stylesheet.dot'?: ViewStyle;
    };

  export interface DayComponentProps {
    date: Datedata;
    marking: Marking;
    state: string;
    theme: CalendarTheme;
    onPress: (date: Datedata) => void;
    onLongPress: (date: Datedata) => void;
  }

  export interface CalendarProps extends ViewProps {
    current?: string;
    minDate?: string;
    maxDate?: string;
    onDayPress?: (date: Datedata) => void;
    onDayLongPress?: (date: Datedata) => void;
    onMonthChange?: (date: Datedata) => void;
    onVisibleMonthsChange?: (months: Datedata[]) => void;
    monthFormat?: string;
    hideArrows?: boolean;
    hideExtraDays?: boolean;
    disableArrowLeft?: boolean;
    disableArrowRight?: boolean;
    disableMonthChange?: boolean;
    firstDay?: number;
    // Removed duplicate declaration of markedDates to avoid conflict with the imported module
    displayLoadingIndicator?: boolean;
    showWeekNumbers?: boolean;
    enableSwipeMonths?: boolean;
    // Removed duplicate declaration of markedDates to avoid conflict with the imported module
    style?: StyleProp<ViewStyle>;
    calendarWidth?: number;
    customHeader?: any;
    dayComponent?: React.ComponentType<DayComponentProps>;
    markingType?: 'period' | 'multi-dot' | 'multi-period' | 'custom';
  }

  export interface CustomAgendaProps extends ViewProps {
    items: { [date: string]: any[] };
    selected?: string;
    renderItem?: (item: any, firstItemInDay: boolean) => React.ReactElement;
    renderEmptyDate?: () => React.ReactElement;
    renderEmptyData?: () => React.ReactElement;
    rowHasChanged?: (r1: any, r2: any) => boolean;
    onDayPress?: (day: Datedata) => void;
    onCalendarToggled?: (calendarOpened: boolean) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
    refreshControl?: React.ReactElement;
    theme?: CalendarTheme;
    style?: StyleProp<ViewStyle>;
  }

  export interface ExpandableCalendarProps extends CalendarProps {
    // Removed duplicate declaration of initialPosition to avoid conflict with the imported module
    disablePan?: boolean;
    hideKnob?: boolean;
    onCalendarToggled?: (open: boolean) => void;
    renderKnob?: () => React.ReactNode;
    closeOnDayPress?: boolean;
    allowShadow?: boolean;
    disableWeekScroll?: boolean;
    disableAllTouchEventsForDisabledDays?: boolean;
    toggleViewControl?: React.ReactNode;
  }

  // Removed duplicate declaration of Calendar to avoid conflict with the imported module
  export class CustomCalendar extends React.Component<CalendarProps> {}
  export class CustomAgenda extends React.Component<CustomAgendaProps> {}
  // Removed duplicate declaration of ExpandableCalendar to avoid conflict with the imported module
}

// Import components after declarations to prevent circular references
import { ExpandableCalendar } from 'react-native-calendars';


const WeeklyMonthlyCalendar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleCalendarView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Fixed: Use only 'open' or 'closed' values for initialPosition */}
      <ExpandableCalendar
        initialPosition={isExpanded ? 'open' : 'closed'}
        onCalendarToggled={(open) => setIsExpanded(open)}
        toggleViewControl={
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCalendarView}>
            <Text style={styles.toggleButtonText}>
              {isExpanded ? 'Switch to Weekly View' : 'Switch to Monthly View'}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default WeeklyMonthlyCalendar;