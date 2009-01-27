<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Testing</title>
		<script type="text/javascript" src="js/jquery-1.2.6.min.js"></script>
		<script type="text/javascript" src="js/calc.js"></script>
	</head>
	<body>
	
		<table border=1 style="float: left;">
			<tr>
				<th>
					Debt Name
				</th>
				
				<th>
					Balance
				</th>
				
				<th>
					Interest
				</th>
				
				<th>
					Minimum Payment
				</th>
			</tr>
			
			<tr id="row1" class="row">
				<td>
					<input type="text" class="debt_name" />
				</td>
				
				<td>
					<input type="text" class="balance"/>
				</td>
					
				<td>
					<input type="text" class="interest" />
				</td>
				
				<td>
					<input type="text" class="minimum_payment"/>
				</td>
			</tr>

			
			<tr>
				<td>
					
				</td>
				
				<td>
					<span id="total_balance">total balance goes here</span>
				</td>
				
				<td>
					<span id="interest">interest goes here</span>
				</td>
				
				<td>
					<span id="total_payment">total payment goes here</span>
				</td>
			</tr>
		</table>
		<span style="float: left;"><input type="button" value="+ row" id="add_a_row" /></span>
		<input type="hidden" id="num_rows" value=1 />
		<div style="clear: both;"></div>
		<input type="button" value="Calculate" id="calculate" />
		
		<input type="button" value="Balance" id="balance" />

		<br />

		Total to pay per month: <input type="text" id="fixed_monthly_payment" /><input type="button" value="Go" id="pay_off_using_fixed" />
		
		<div class="results">
			<span id="results"></span>
			
		</div>
		
	
	</body>
</html>
