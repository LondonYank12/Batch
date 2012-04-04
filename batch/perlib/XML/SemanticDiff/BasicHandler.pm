package XML::SemanticDiff::BasicHandler;

use strict;
use vars qw/$VERSION/;

$VERSION = '0.93';

sub new {       
    my ($proto, %args) = @_;
    my $class = ref($proto) || $proto;
    my $self  = \%args;
    bless ($self, $class);
    return $self;
}

sub rogue_element {
    my $self = shift;
    my ($element, $properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context => $parent,
                message => "Rogue element '$element_name' in element '$parent'."};
    
    if ($self->{keeplinenums}) {
        $info->{startline} = $properties->{TagStart};
        $info->{endline}   = $properties->{TagEnd};
    }
 
    if ($self->{keepdata}) {
        $info->{new_value} = $properties->{CData};
    }    
    return $info;
}

sub missing_element {
    my $self = shift;
    my ($element, $properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context => $parent,
                message => "Child element '$element_name' missing from element '$parent'."};
                 
    if ($self->{keeplinenums}) {
        $info->{startline} = $properties->{TagStart};
        $info->{endline}   = $properties->{TagEnd};
    }
    if ($self->{keepdata}) {
        $info->{old_value} = $properties->{CData};
    }
    return $info;
}

sub element_value {
    my $self = shift;
    my ($element, $new_properties, $old_properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);

    my $info = {context => $element,
                message => "Character differences in element '$element_name'."};
                       
    if ($self->{keeplinenums}) {
        $info->{startline} = $new_properties->{TagStart};
        $info->{endline}   = $new_properties->{TagEnd};
    }
                  
    if ($self->{keepdata}) {
        $info->{old_value} = $old_properties->{CData};
        $info->{new_value} = $new_properties->{CData};
    }

    return $info;
}

sub rogue_attribute {
    my $self = shift;    
    my ($attr, $element, $properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context  => $element,
                message  => "Rogue attribute '$attr' in element '$element_name'."};
        
    if ($self->{keeplinenums}) {
        $info->{startline} = $properties->{TagStart};
        $info->{endline}   = $properties->{TagEnd};
    }

    if ($self->{keepdata}) {
        $info->{new_value} = $properties->{Attributes}->{$attr};
    }
    return $info;
}

sub missing_attribute {
    my $self = shift;
    my ($attr, $element, $new_properties, $old_properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context  => $element,
                message  => "Attribute '$attr' missing from element '$element_name'."};
         
    if ($self->{keeplinenums}) {
        $info->{startline} = $new_properties->{TagStart};
        $info->{endline}   = $new_properties->{TagEnd};
    }

    if ($self->{keepdata}) {
        $info->{old_value} = $old_properties->{Attributes}->{$attr};
    }
    return $info;
}

sub attribute_value {
    my $self = shift;
    my ($attr, $element, $new_properties, $old_properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context  => $element,
                message  => "Attribute '$attr' has different value in element '$element_name'."};
                  
    if ($self->{keeplinenums}) {
        $info->{startline} = $new_properties->{TagStart};
        $info->{endline}   = $new_properties->{TagEnd};
    }
        
    if ($self->{keepdata}) {
        $info->{old_value} = $old_properties->{Attributes}->{$attr};
        $info->{new_value} = $new_properties->{Attributes}->{$attr};
    }
    return $info;
}

sub namespace_uri {
    my $self = shift;
    my ($element, $new_properties, $old_properties) = @_;
    my ($element_name, $parent) = parent_and_name($element);
    my $info = {context  => $element,
                message  => "Element '$element_name' within different namespace."};
            
    if ($self->{keeplinenums}) {
        $info->{startline} = $new_properties->{TagStart};
        $info->{endline}   = $new_properties->{TagEnd};
    }
                            
    if ($self->{keepdata}) {
        $info->{old_value} = $old_properties->{NamspaceURI};
        $info->{new_value} = $new_properties->{NamspaceURI};
    }
    return $info;
}

sub parent_and_name {
    my $element = shift;
    my @steps = split('/', $element);   
    my $element_name = pop (@steps);
    my $parent = join '/', @steps;
    $element_name =~ s/\[\d+\]$//;
    return ($element_name, $parent);
}

1;
__END__
# Below is the stub of documentation for your module. You better edit it!

=head1 NAME

XML::SemanticDiff::BasicHandler - Default handler class for XML::SemanticDiff

=head1 SYNOPSIS

  use XML::SemanticDiff;
  my $diff = XML::SemanticDiff->new();
        
  foreach my $change ($diff->compare($file, $file2)) {
      print "$change->{message} in context $change->{context}\n";
  }

=head1 DESCRIPTION

This is the default event handler for XML::SemanticDiff. It implements nothing useful apart from the parent class and should
never be used directly.

Please run perldoc XML::SemanticDiff for more information.

=head1 AUTHOR

Kip Hampton khampton@totalcinema.com

=head1 COPYRIGHT
                  
Copyright (c) 2000 Kip Hampton. All rights reserved. This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.

=head1 SEE ALSO

XML::SemanticDiff

=cut

