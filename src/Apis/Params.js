export function TIME_SERIES_INTRADAY(symbol = "MSFT") {
  return {interval: '5min',
  function: 'TIME_SERIES_INTRADAY',
  symbol,
  datatype: 'json',
  output_size: 'compact'
  }
}

export function TIME_SERIES_DAILY(symbol = "MSFT") {
  return {
    function: 'TIME_SERIES_DAILY',
    symbol,
    outputsize: 'compact',
    datatype: 'json'
  }
}

export function TIME_SERIES_WEEKLY(symbol = "MSFT") {
  return {function: 'TIME_SERIES_WEEKLY', symbol, datatype: 'json'}
}

export function GLOBAL_QUOTE(symbol = "MSFT") {
  return {function: 'GLOBAL_QUOTE', symbol, datatype: 'json'}
}

export function SYMBOL_SEARCH(keywords = "microsoft") {
  return {keywords, function: 'SYMBOL_SEARCH', datatype: 'json'}
}
