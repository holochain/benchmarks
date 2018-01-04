$| = 1;
my $chain = 0.0;
my $dht = 0.0;
my $net = 0.0;
my $cpu = 0.0;
foreach $line ( <STDIN> ) {
    chomp( $line );

    $chain += $1 if $line =~ /Chain growth: ([0-9.]+)K/;
    $dht += $1 if $line =~ /DHT growth: ([0-9.]+)K/;
    $net += $1 if $line =~ /BytesSent: ([0-9.]+)K/;
    $cpu += $1 if $line =~ /CPU: ([0-9.]+)ms/;
}

print "Total chain: $chain\n";
print "Total DHT: $dht\n";
print "Total Bytes Sent: $net\n";
print "Total CPU: $cpu\n";
