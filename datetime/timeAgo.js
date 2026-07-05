import React from 'react';
import { Text } from 'react-native';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

const TimeAgo = ({ date }) => {
  const timeAgo = formatDistanceToNowStrict(parseISO(date), {
    addSuffix: true,
  });

  return <Text>{timeAgo}</Text>;
};

export default TimeAgo;