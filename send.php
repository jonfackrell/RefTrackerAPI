<?php
	if(isset($_GET['url'])){
		$to = "jon.fackrell@gmail.com";
		$subject = "Javascript Error";		
		$headers = "From: " . $to . "\r\n";
		$headers .= "Reply-To: ". $to . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$message = "URL: ";
		$message .= $_GET['url'];
		$message .= "<br />";
		$message .= "Line Number: ";
		$message .= $_GET['lineNumber'];
		$message .= "<br />";
		$message .= "Error Message: ";
		$message .= $_GET['errorMsg'];
		
		mail($to, $subject, $message, $headers);
	}
echo '<!-- Email Sent :-) -->';

?>