//need to remove anything but numbers, minus signs, and periods
//add in $ and , for output
function calculate()
{	
	var total_balance = 0
	var total_payment = 0

	//$( '#total_balance' ).text('').empty()

	$( '.balance' ).each(
		function()
		{
			var val = $( this ).val() * 1
			if( ! isNaN( val ) )
				total_balance += val
		} // function
	) // each
	
	$( '.minimum_payment' ).each(
		function()
		{
			var val = $( this ).val() * 1
			if( ! isNaN( val ) )
				total_payment += val
		} // function
	) // each
	
	
	$( '#total_balance' ).text( money_format( total_balance ) )
	$( '#total_payment' ).text( money_format( total_payment ) )
} // calculate

function money_format( number )
{
	number = number.toFixed( 2 )

	number += ''
	parts = number.split( '.' )
	part1 = parts[0]
	part2 = parts.length > 1 ? '.' + parts[1] : ''
	
	var rgx = /(\d+)(\d{3})/
	
	while ( rgx.test( part1 ) ) 
		part1 = part1.replace( rgx, '$1' + ',' + '$2' )
		
	number = part1 + part2
	
	return number
} // money_format

function final_balance( amount_borrowed, amount_paid_per_payment, apr, years )
{
	//var balance, amount_borrowed, payments_per_year, amount_paid_per_payment, apr, years
	payments_per_year = 12
	
	part1 = amount_borrowed * ( Math.pow( ( 1 + apr / payments_per_year ), ( payments_per_year * years ) ) )
	part2 = amount_paid_per_payment
	part3 = Math.pow( ( 1 + apr / payments_per_year ), ( payments_per_year * years ) ) - 1 
	part4 = ( 1 + apr / payments_per_year ) - 1 
	
	balance = part1 - ( part2 * ( part3 / part4 ) )
	
	
	//balance = ( amount_borrowed * ( Math.pow( (1 + apr / payments_per_year ), (payments_per_year * years) ) ) ) - ( ( amount_borrowed * Math.pow( ( 1 + ( apr / payments_per_year ) ),  ( payments_per_year * years ) )- 1 ) / ( ( 1 + ( apr / payments_per_year ) ) - 1 ) )
	
	return balance
	
} // final_balance

function how_long_till_zero( balance, payment, apr )
{
	balance = balance * 1
	payment = payment * 1
	apr = apr * 1
	
	if( payment <= 0 )
		die
	
	var total_charges
	var months = new Array()
	var c = 0
	var monthly_apr = apr/12
	
	var summary
	
	summary = "<table border=1>"
	summary += "<tr>"
		summary += "<th>Month</th>"
		summary += "<th>Payment</th>"
		summary += "<th>Finance Charge</th>"
		summary += "<th>Balance</th>"
	summary += "</tr>"
	
	summary += "<tr>"
		summary += "<td>0</td>"
		
		summary += "<td></td>"
		summary += "<td></td>"
		summary += "<td>" + money_format( balance ) + "</td>"
	summary += "</tr>"
	
	
	
	while( balance > 0 )
	{
		summary += "<tr>"
		
	
		if( balance < payment )
			payment = balance
			
		balance -= payment
		finance_charge = balance * monthly_apr
		total_charges += finance_charge
		balance += balance * monthly_apr
		
		summary += "<td>" + (c + 1 ) + "</td>"
		summary += "<td>" + money_format( payment ) + "</td>"
		summary += "<td>" + money_format( finance_charge ) + "</td>"
		summary += "<td>" + money_format( balance ) + "</td>"
		
		summary += "</tr>"
		
		
		
		//console.log( balance )
		
		c++

				
	} // while
	$( '#results' ).text( 'It will take ' + c + ' months to get out of debt.' )
	
	summary += "</table>"	

	
	$( '.results' ).append( summary )
	
} // how_long_till_zero

$( document ).ready(

	function()
	{
		$( '#calculate' ).click( calculate )
		
		$( '.balance, .minimum_payment' ).blur( calculate )
		
		$( '#balance' ).click(
			function()
			{
				balance = prompt( 'Initial Balance' )
				payment = prompt( 'Payment' )
				apr = prompt( 'APR' )
				how_long_till_zero( balance, payment, apr )
			
				/*
amount_borrowed = prompt( 'Amount Borrowed' )
				amount_paid_per_payment = prompt( 'Amount Paid Per Payment' )
				apr = prompt( 'APR' )
				years = prompt( 'Years' )
				
				alert( 'Balance = ' + final_balance( amount_borrowed, amount_paid_per_payment, apr, years ) )
*/
			
				
			} // function
		) // click
	} // function
) // ready