-- Per-product currency support.
alter table stock_items
  add column currency text not null default 'EUR'
  check (currency in ('EUR', 'USD', 'GBP', 'NOK', 'SEK', 'DKK', 'JPY', 'SGD', 'CNY'));
