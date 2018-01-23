=begin comment
This is a script to run the benchmark a number of times and average the results
example usage:
$ cd approvedList
$ perl ../bench.pl
Total chain: 556.23
    Total DHT: 6340.86
    Total Bytes Sent: 6306.16
    Total CPU: 3700

=end comment
=cut


sub run {

    my $x =  `hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark`;

    my @lines = split /\n/,$x;
    my $chain = 0.0;
    my $dht = 0.0;
    my $net = 0.0;
    my $gossip = 0.0;
    my $cpu = 0.0;
    foreach $line (@lines) {
        #    print $line;
        #    chomp( $line );

        $chain += $1 if $line =~ /Chain growth: ([0-9.]+)K/;
        $dht += $1 if $line =~ /DHT growth: ([0-9.]+)K/;
        $net += $1 if $line =~ /BytesSent: ([0-9.]+)K/;
        $gossip += $1 if $line =~ /GossipSent: ([0-9.]+)K/;
        $cpu += $1 if $line =~ /CPU: ([0-9.]+)ms/;
    }
    my %values;
    $values{'chain'} = $chain;
    $values{'dht'} = $dht;
    $values{'net'} = $net;
    $values{'gossip'} = $gossip;
    $values{'cpu'} = $cpu;
    return \%values;
}

my $count = 10;
my @runs;
foreach my $i (0..$count-1) {
    $runs[$i] = &run();
}

my $chain = 0.0;
my $dht = 0.0;
my $net = 0.0;
my $gossip = 0.0;
my $cpu = 0.0;

foreach my $i (0..$count-1) {
    my $values = $runs[$i];
    $chain += $values->{'chain'};
    $dht += $values->{'dht'};
    $net += $values->{'net'};
    $gossip += $values->{'gossip'};
    $cpu += $values->{'cpu'};
}

$chain /= $count;
$dht /= $count;
$net /= $count;
$gossip /= $count;
$cpu /= $count;

print "Total chain: ${chain}K\n";
print "Total DHT: ${dht}K\n";
print "Total Bytes Sent: ${net}K\n";
print "Total Gossip Sent: ${gossip}K\n";
print "Total CPU: ${cpu}ms\n";
