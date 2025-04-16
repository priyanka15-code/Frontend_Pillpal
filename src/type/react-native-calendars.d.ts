declare module 'react-native-calendars' {
  import React from 'react';
  import {
    ViewStyle,
    TextStyle,
    StyleProp,
    ViewProps,
    TextProps
  } from 'react-native';

  export interface DayComponentProps {
    date: { dateString: string; day: number; month: number; year: number };
    marking: Marking;
    state: string;
    theme: CalendarTheme;
    onPress: (date: { dateString: string }) => void;
    onLongPress: (date: { dateString: string }) => void;
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

  export interface CalendarTheme {
    backgroundColor?: string;
    calendarBackground?: string;
    textSectionTitleColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    todayTextColor?: string;
    dayTextColor?: string;
    textDisabledColor?: string;
    dotColor?: string;
    selectedDotColor?: string;
    arrowColor?: string;
    monthTextColor?: string;
    indicatorColor?: string;
    textDayFontFamily?: string;
    textMonthFontFamily?: string;
    textDayHeaderFontFamily?: string;
    textDayFontSize?: number;
    textMonthFontSize?: number;
    textDayHeaderFontSize?: number;
    textDayFontWeight?: string;
    textMonthFontWeight?: string;
    textDayHeaderFontWeight?: string;
    'stylesheet.calendar.header'?: ViewStyle;
    'stylesheet.day.basic'?: ViewStyle;
    'stylesheet.dot'?: ViewStyle;
  }

  export interface CalendarProps extends ViewProps {
    current?: string;
    minDate?: string;
    maxDate?: string;
    onDayPress?: (day: { dateString: string; day: number; month: number; year: number }) => void;
    onDayLongPress?: (day: { dateString: string }) => void;
    onMonthChange?: (date: { dateString: string; month: number; year: number }) => void;
    onVisibleMonthsChange?: (months: { dateString: string; month: number; year: number }[]) => void;
    monthFormat?: string;
    hideArrows?: boolean;
    hideExtraDays?: boolean;
    disableArrowLeft?: boolean;
    disableArrowRight?: boolean;
    disableMonthChange?: boolean;
    firstDay?: number;
    markedDates?: { [date: string]: Marking };
    displayLoadingIndicator?: boolean;
    showWeekNumbers?: boolean;
    theme?: CalendarTheme;
    style?: StyleProp<ViewStyle>;
    calendarWidth?: number;
    customHeader?: React.ComponentType<any>;
    dayComponent?: React.ComponentType<DayComponentProps>;
    markingType?: 'period' | 'multi-dot' | 'multi-period' | 'custom';
  }

  export class Calendar extends React.Component<CalendarProps> {}

  export interface AgendaProps extends ViewProps {
    items: { [date: string]: any[] };
    selected?: string;
    renderItem?: (item: any, firstItemInDay: boolean) => React.ReactElement;
    renderEmptyDate?: () => React.ReactElement;
    renderEmptyData?: () => React.ReactElement;
    rowHasChanged?: (r1: any, r2: any) => boolean;
    onDayPress?: (day: { dateString: string }) => void;
    onCalendarToggled?: (calendarOpened: boolean) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
    refreshControl?: React.ReactElement;
    theme?: CalendarTheme;
    style?: StyleProp<ViewStyle>;
  }

  export class Agenda extends React.Component<AgendaProps> {}

  

  export interface ExpandableCalendarProps extends CalendarProps {
    disablePan?: boolean;
    hideKnob?: boolean;
    initialPosition?: 'open' | 'closed';
    onCalendarToggled?: (open: boolean) => void;
    renderKnob?: () => React.ReactNode;
    closeOnDayPress?: boolean;
    allowShadow?: boolean;
    disableWeekScroll?: boolean;
    disableAllTouchEventsForDisabledDays?: boolean;
  }

  export const ExpandableCalendar: React.FC<ExpandableCalendarProps>;
}
