/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <Foundation/Foundation.h>

#import "ProgressView.h"

@interface ProgressView ()
@property(nonatomic, strong) UIView *progressFillView;
@property(nonatomic, strong) UIView *progressBackgroundView;
@property(nonatomic) BOOL animateHide;
@end

@implementation ProgressView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self progressViewInit];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self progressViewInit];
    }
    return self;
}

- (void)progressViewInit {
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleTopMargin;
    self.backgroundColor = [UIColor clearColor];
    self.clipsToBounds = YES;
    self.isAccessibilityElement = YES;
    
    self.progressBackgroundView = [[UIView alloc] initWithFrame:self.frame];
    [self.progressBackgroundView setAutoresizingMask:UIViewAutoresizingFlexibleWidth];
    [self addSubview:self.progressBackgroundView];
    
    self.progressFillView = [[UIView alloc] initWithFrame:CGRectZero];
    [self addSubview:self.progressFillView];
    
    [self.progressFillView setBackgroundColor:[UIColor colorWithRed:1.0 green:0.0 blue:1.0 alpha:1.0]];
    [self.progressBackgroundView setBackgroundColor:[UIColor colorWithRed:0.0 green:1.0 blue:1.0 alpha:1.0]];
    
    self.progressValue = 0.0;
    self.animationDuration = 0.25;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    if (!self.animateHide) {
        [self updateProgressBackgroundView];
        [self updateProgressFillView];
    }
}

- (UIColor *)progressFillColor {
    return self.progressFillView.backgroundColor;
}

- (void)setProgressFillColor:(UIColor *)fillColor {
    if (fillColor == nil) {
        fillColor = [UIColor colorWithRed:1.0 green:0.0 blue:1.0 alpha:1.0];
    }
    [self.progressFillView setBackgroundColor:fillColor];
}

- (UIColor *)progressBackgroundColor {
    return self.progressBackgroundView.backgroundColor;
}

- (void)setProgressBackgroundColor:(UIColor *)backgroundColor {
    if (backgroundColor == nil) {
        backgroundColor = [UIColor colorWithRed:0.0 green:1.0 blue:1.0 alpha:1.0];
    }
    [self.progressBackgroundView setBackgroundColor:backgroundColor];
}

- (void)setProgressValue:(float)value {
    _progressValue = MAX( MIN( value, 1.0 ), 0.0 );
    [self setNeedsLayout];
}

- (void)setProgressValue:(float)value
           animated:(BOOL)animated
         completion:(void (^__nullable)(BOOL complete))completion {
    _progressValue = value;
    [UIView animateWithDuration:animated ? self.animationDuration : 0
                          delay:0
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                         [self updateProgressFillView];
                     }
                     completion:completion];
}

- (void)setHidden:(BOOL)hidden {
    [super setHidden:hidden];
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, hidden ? nil : self);
}

- (void)setHidden:(BOOL)hidden
         animated:(BOOL)animated
       completion:(void (^__nullable)(BOOL complete))completion {
    if (hidden == self.hidden) {
        if (completion) {
            completion(YES);
        }
        return;
    }
    
    void (^animations)(void);
    
    if (hidden) {
        self.animateHide = YES;
        animations = ^{
            CGFloat y = CGRectGetHeight(self.bounds);
            
            CGRect backgroundViewFrame = self.progressBackgroundView.frame;
            backgroundViewFrame.origin.y = y;
            backgroundViewFrame.size.height = 0;
            self.progressBackgroundView.frame = backgroundViewFrame;
            
            CGRect fillViewFrame = self.progressFillView.frame;
            fillViewFrame.origin.y = y;
            fillViewFrame.size.height = 0;
            self.progressFillView.frame = fillViewFrame;
        };
    } else {
        self.hidden = NO;
        animations = ^{
            self.progressBackgroundView.frame = self.bounds;
            
            CGRect fillViewFrame = self.progressFillView.frame;
            fillViewFrame.origin.y = 0;
            fillViewFrame.size.height = CGRectGetHeight(self.bounds);
            self.progressFillView.frame = fillViewFrame;
        };
    }
    
    [UIView animateWithDuration:animated ? self.animationDuration : 0
                          delay:0
                        options:UIViewAnimationOptionCurveLinear
                     animations:animations
                     completion:^(BOOL complete) {
                         if (hidden) {
                             self.animateHide = NO;
                             self.hidden = YES;
                         }
                         if (completion) {
                             completion(complete);
                         }
                     }];
}

- (void)updateProgressFillView {
    
    CGFloat progressWidth = ceilf( self.progressValue * CGRectGetWidth(self.bounds) );
    CGRect progressFrame = CGRectMake(0, 0, progressWidth, CGRectGetHeight(self.bounds));
    [self.progressFillView setFrame:progressFrame];
}

- (void)updateProgressBackgroundView {
    const CGSize size = self.bounds.size;
    [self.progressBackgroundView setFrame: self.hidden ? CGRectMake(0.0, size.height, size.width, 0.0) : self.bounds];
}

@end
